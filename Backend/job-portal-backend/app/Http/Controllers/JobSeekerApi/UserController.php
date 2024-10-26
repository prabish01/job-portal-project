<?php

namespace App\Http\Controllers\JobSeekerApi;

use App\Http\Controllers\Controller;
use App\Models\JobSeeker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => "required|string|max:255",
            'email' => "required|email",
            'password' => "required|confirmed",
            "mobile" => "required|string",
            "current_address" =>  "required|string",
            "permanent_address" =>  "required|string",
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => true, 'errors' => $validator->errors()], 422);
        }

        if (JobSeeker::where('email', $request->email)
            ->exists()
        ) {
            return response()->json(['error' => true, 'message' => 'User already exists'], 400);
        }
        JobSeeker::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'mobile' => $request->mobile,
            'current_address' => $request->current_address,
            'permanent_address' => $request->permanent_address
        ]);

        return response()->json(['success' => true, 'message' => 'Account created. Login to proceed'], 201);
    }

    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required',
            'password' => 'required',

        ]);


        $credentials = $request->only('email', 'password');

        $jobseeker = JobSeeker::where('email', $credentials['email'])->first();

        if ($jobseeker?->password && Hash::check($request->password, $jobseeker->password)) {
            $token = $jobseeker->createToken('Personal Access Token')->accessToken;
            return response()->json(['success' => true, 'message' => 'Login Successfull.', 'token' => $token], 200);
        } else {
            return response()->json(['error' => true, 'message' => 'Invalid Credentials'], 401);
        }
    }

    public function logout()
    {
        auth()->user()->token()->revoke();
        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out'
        ]);
    }

    public function changePassword(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:4|confirmed|different:current_password',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => true, 'errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => true, 'message' => 'Current password is incorrect'], 400);
        }


        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['success' => true, 'message' => 'Password successfully changed'], 200);
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => true, 'errors' => $validator->errors(), 'message' => MessageHelper::getErrorMessage('form')], 422);
        }
        $user = JobSeeker::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'true', 'message' => 'No student found with this email or company.'], 400);
        }
        do {
            $otp = rand(10000, 99999);
            $existingOtp = JobSeeker::where('otp', $otp)->first();
        } while ($existingOtp);

        $token = Password::createToken($user);

        $user->notify(new OTPNotification($otp, $token, $request->email, 'student'));
        $user->otp = $otp;
        $user->otp_expires_at = now()->addMinutes(60);
        $user->token = $token;
        $user->save();
        return response()->json(['success' => true, 'message' => 'OTP and reset link sent to email.'], 200);
    }
}
