<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailVerificationNotification extends Notification
{
    use Queueable;

    public $id;
    public $token;
    /**
     * Create a new notification instance.
     */
    public function __construct($id, $token)
    {
        $this->id = $id;
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $data = [];
        $data['url'] = config('custom.client_app.frontend_url') . '/student/settings?active_tab=2&student_id='. $this->id.'&token='.$this->token;
        return (new MailMessage)->subject('Verify Your Email')->view('mail.verification-email', $data);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
