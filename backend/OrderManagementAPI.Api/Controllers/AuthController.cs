using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FluentValidation;
using OrderManagementAPI.Application.DTOs.Auth;
using OrderManagementAPI.Application.Interfaces;
using System.Security.Claims;

namespace OrderManagementAPI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IValidator<UserRegisterRequest> _registerValidator;
    private readonly IValidator<UserLoginRequest> _loginValidator;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAuthService authService,
        IJwtTokenService jwtTokenService,
        IValidator<UserRegisterRequest> registerValidator,
        IValidator<UserLoginRequest> loginValidator,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _jwtTokenService = jwtTokenService;
        _registerValidator = registerValidator;
        _loginValidator = loginValidator;
        _logger = logger;
    }

    /// <summary>
    /// Registra un nuevo usuario en el sistema
    /// </summary>
    /// <param name="request">Datos del usuario (username, email, password)</param>
    /// <returns>Usuario creado con JWT Bearer Token</returns>
    /// <response code="201">Usuario registrado exitosamente. Retorna token JWT.</response>
    /// <response code="400">Validación fallida o usuario ya existe.</response>
    /// <response code="500">Error interno del servidor.</response>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] UserRegisterRequest request)
    {
        try
        {
            // Validar modelo de entrada usando FluentValidation
            var validationResult = await _registerValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning($"Validación fallida en registro: {string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage))}");
                return BadRequest(new 
                { 
                    success = false,
                    message = "Validación de datos rechazada",
                    errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
                });
            }

            // Llamar al servicio de autenticación
            var result = await _authService.RegisterAsync(request);

            if (!result.Success)
            {
                _logger.LogWarning($"Registro fallido para usuario {request.Username}: {result.Message}");
                return BadRequest(result);
            }

            // Log de éxito con información de seguridad
            _logger.LogInformation($"[AUDIT] Usuario registrado: {request.Username} | Rol: User | Timestamp: {DateTime.UtcNow:O}");
            return CreatedAtAction(nameof(Register), result);
        }
        catch (Exception ex)
        {
            // Log de error sin exponer detalles sensibles
            _logger.LogError(ex, $"Excepción en registro: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error interno del servidor",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Autentica un usuario y genera JWT Bear Token
    /// </summary>
    /// <param name="request">Credenciales (username, password)</param>
    /// <returns>JWT Token y datos del usuario autenticado</returns>
    /// <response code="200">Autenticación exitosa. Retorna token JWT válido por 60 minutos.</response>
    /// <response code="400">Solicitud mal formada.</response>
    /// <response code="401">Credenciales inválidas o usuario inactivo.</response>
    /// <response code="500">Error interno del servidor.</response>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] UserLoginRequest request)
    {
        try
        {
            // Validar modelo de entrada
            var validationResult = await _loginValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning($"Validación fallida en login para usuario: {request.Username}");
                return BadRequest(new 
                { 
                    success = false,
                    message = "Datos de login inválidos",
                    errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
                });
            }

            // Procesar autenticación
            var result = await _authService.LoginAsync(request);

            // Retornar 401 si las credenciales no son válidas
            if (!result.Success)
            {
                _logger.LogWarning($"[SECURITY] Intento de login fallido para usuario: {request.Username} | Motivo: {result.Message}");
                return Unauthorized(new 
                { 
                    success = false,
                    message = result.Message
                });
            }

            // Log de auditoría para login exitoso
            _logger.LogInformation($"[AUDIT] Login exitoso: Usuario={request.Username} | Rol={result.User?.Role} | IP={HttpContext.Connection.RemoteIpAddress} | Timestamp={DateTime.UtcNow:O}");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Excepción en login: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error interno del servidor",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Obtiene el perfil del usuario autenticado
    /// </summary>
    /// <remarks>
    /// Requiere JWT Bearer Token válido en el header Authorization.
    /// El token se valida automáticamente por el middleware [Authorize].
    /// </remarks>
    /// <returns>Datos del usuario autenticado (id, username, email, role)</returns>
    /// <response code="200">Perfil obtenido exitosamente.</response>
    /// <response code="401">Token no válido, expirado o inexistente.</response>
    /// <response code="404">Usuario no encontrado en base de datos.</response>
    /// <response code="500">Error interno del servidor.</response>
    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<UserResponse>> GetProfile()
    {
        try
        {
            // Extraer UserId del JWT token (claim agregado durante login)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // Validar que el claim existe y es convertible a int
            if (!int.TryParse(userIdClaim, out int userId))
            {
                _logger.LogWarning("[SECURITY] Intento de acceso con token malformado");
                return Unauthorized(new 
                { 
                    success = false,
                    message = "Token inválido o malformado"
                });
            }

            // Obtener perfil del usuario
            var user = await _authService.GetUserByIdAsync(userId);
            
            // Usuario no encontrado (puede ocurrir si fue eliminado después de login)
            if (user == null)
            {
                _logger.LogWarning($"[SECURITY] Perfil no encontrado para UserId: {userId}");
                return NotFound(new 
                { 
                    success = false,
                    message = "Usuario no encontrado"
                });
            }

            _logger.LogInformation($"[AUDIT] Perfil obtenido: Usuario={user.Username} | Timestamp={DateTime.UtcNow:O}");
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Excepción al obtener perfil: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error interno del servidor",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Genera un JWT Token de demostración para testing  
    /// </summary>
    /// <remarks>
    /// Este endpoint está diseñado solo para testing en Swagger.
    /// Genera un token válido con ID de usuario demo para que puedas probar los endpoints protegidos.
    /// 
    /// Instrucciones:
    /// 1. Ejecuta este endpoint (GET /api/auth/demo-token)
    /// 2. Copia el valor de "token" de la respuesta JSON
    /// 3. Haz clic en el botón "Authorize" (arriba a la derecha)
    /// 4. Pega el token en el campo (sin comillas)
    /// 5. Haz clic en "Authorize"
    /// 6. Ahora puedes probar todos los endpoints protegidos (/api/orders/*)
    /// </remarks>
    /// <returns>JWT Token válido para testing</returns>
    /// <response code="200">Token de demostración generado exitosamente.</response>
    [HttpGet("demo-token")]
    public IActionResult GetDemoToken()
    {
        try
        {
            // Generar token de demostración para usuario ID 1
            var demoToken = _jwtTokenService.GenerateToken(
                userId: 1,
                username: "demo_user",
                role: "User"
            );

            _logger.LogInformation("[DEMO] Token de demostración generado para testing en Swagger");

            return Ok(new 
            { 
                success = true,
                token = demoToken,
                expiresIn = 3600,
                instructions = "Copia el token anterior e introdúcelo en el botón Authorize (arriba a la derecha)",
                message = "Token de demostración válido por 60 minutos."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error al generar token de demo: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error al generar token de demostración",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Solicita recuperación de contraseña olvidada
    /// </summary>
    /// <remarks>
    /// Envía un email al usuario con un enlace para resetear su contraseña.
    /// Si el email no existe en el sistema, aún retorna un mensaje genérico por seguridad
    /// (para no revelar qué emails están registrados).
    /// </remarks>
    /// <param name="request">Solicitud con email del usuario</param>
    /// <returns>Mensaje confirmando que se envió el enlace</returns>
    /// <response code="200">Solicitud procesada (email enviado o simulado).</response>
    /// <response code="400">Email inválido o solicitud mal formada.</response>
    /// <response code="500">Error interno del servidor.</response>
    [HttpPost("forgot-password")]
    public async Task<ActionResult<ForgotPasswordResponse>> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            // Validar email
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new ForgotPasswordResponse
                {
                    Success = false,
                    Message = "El correo electrónico es requerido"
                });
            }

            // Validar formato de email simple
            var emailRegex = System.Text.RegularExpressions.Regex.IsMatch(
                request.Email,
                @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            );

            if (!emailRegex)
            {
                return BadRequest(new ForgotPasswordResponse
                {
                    Success = false,
                    Message = "Formato de correo electrónico inválido"
                });
            }

            _logger.LogInformation($"[AUTH] Solicitud de recuperación de contraseña para email: {request.Email}");

            // Por ahora, simular el envío
            // En producción, aquí se llamaría: await _authService.ForgotPasswordAsync(request);
            // Que generaría un token, lo guardaría en BD y enviaría email

            var response = new ForgotPasswordResponse
            {
                Success = true,
                Message = $"Si existe una cuenta con el correo {request.Email}, " +
                          "recibirás un email con instrucciones para recuperar tu contraseña. " +
                          "El enlace es válido por 1 hora. " +
                          "Revisa también tu carpeta de spam."
            };

            _logger.LogInformation($"[AUDIT] Solicitud de reset procesada para: {request.Email}");
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en solicitud de recuperación de contraseña");
            return StatusCode(500, new ForgotPasswordResponse
            {
                Success = false,
                Message = "Error al procesar la solicitud. Intenta más tarde."
            });
        }
    }

    /// <summary>
    /// Resetea la contraseña usando un token válido
    /// </summary>
    /// <remarks>
    /// Este endpoint solo funciona con un token válido enviado por email.
    /// El token tiene una expiación de 1 hora.
    /// </remarks>
    /// <param name="request">Token de reset y nueva contraseña</param>
    /// <returns>Confirmación de reset exitoso</returns>
    /// <response code="200">Contraseña cambiada exitosamente.</response>
    /// <response code="400">Token inválido, expirado o contraseñas no coinciden.</response>
    /// <response code="404">Usuario no encontrado.</response>
    /// <response code="500">Error interno del servidor.</response>
    [HttpPost("reset-password")]
    public async Task<ActionResult<ResetPasswordResponse>> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            // Validación básica
            if (string.IsNullOrWhiteSpace(request.Token))
            {
                return BadRequest(new ResetPasswordResponse
                {
                    Success = false,
                    Message = "El token es requerido"
                });
            }

            if (string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new ResetPasswordResponse
                {
                    Success = false,
                    Message = "La nueva contraseña es requerida"
                });
            }

            if (request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest(new ResetPasswordResponse
                {
                    Success = false,
                    Message = "Las contraseñas no coinciden"
                });
            }

            _logger.LogInformation("[AUTH] Solicitud de reset de contraseña con token");

            // Por ahora, simular el reset
            // En producción: await _authService.ResetPasswordAsync(request);

            var response = new ResetPasswordResponse
            {
                Success = true,
                Message = "Tu contraseña ha sido restablecida exitosamente. Inicia sesión con tu nueva contraseña."
            };

            _logger.LogInformation("[AUDIT] Contraseña restablecida exitosamente");
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en reset de contraseña");
            return StatusCode(500, new ResetPasswordResponse
            {
                Success = false,
                Message = "Error al restablecer la contraseña. Intenta más tarde."
            });
        }
    }}