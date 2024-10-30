<?php

use App\Http\Controllers\JobSeekerApi\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('jobseeker/register',[UserController::class,'register']);
Route::post('jobseeker/login',[UserController::class,'login']);
Route::post('jobseeker/forgot-password',[UserController::class,'forgotPassword']);
Route::post('jobseeker/verify-token', [UserController::class, 'verifyToken']);
Route::post('jobseeker/verify-otp', [UserController::class, 'verifyOTP']);
Route::post('jobseeker/reset-password',[UserController::class,'resetPassword']);

Route::group(['middleware' => 'auth:jobseeker_api'], function () {
    Route::prefix('jobseeker')->group(function(){
        Route::post('logout',[UserController::class,'logout']);
        Route::post('change-password',[UserController::class,'changePassword']);
        Route::post('send-verification-email', [UserController::class, 'sendVerificationEmail']);
        Route::get('verify-email/{id}/{token}', [UserController::class, 'verifyEmail']);

    });
});