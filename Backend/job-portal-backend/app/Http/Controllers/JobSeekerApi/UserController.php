<?php

namespace App\Http\Controllers\JobSeekerApi;

use App\Http\Controllers\Controller;
use App\Models\JobSeeker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(),[
            'name' => "required|string|max:255",
            'email' => "required|email",
            'password' => "required|confirmed",
            "mobile" => "required|string",
            "current_address" =>  "required|string",
            "permanent_address" =>  "required|string",
        ]);
        if($validator->fails())
        {
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
            return response()->json(['error' =>true, 'message' => 'Invalid Credentials'], 401);
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
}
