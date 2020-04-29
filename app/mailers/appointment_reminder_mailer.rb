class AppointmentReminderMailer < ApplicationMailer
    default from: Rails.application.credentials.gmailsmtp[:username]

    def appointment_reminder(contact)
        @contact = contact
        mail(to: Rails.application.credentials.gmailsmtp[:clinicinbox], from: @contact.email, :subject => "MS Dental clinic service appointment reminder")
    end
end
