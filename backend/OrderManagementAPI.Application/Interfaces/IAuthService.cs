using OrderManagementAPI.Application.DTOs.Auth;

namespace OrderManagementAPI.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(UserRegisterRequest request);
    Task<AuthResponse> LoginAsync(UserLoginRequest request);
    Task<UserResponse?> GetUserByIdAsync(int userId);
    Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request);
}
