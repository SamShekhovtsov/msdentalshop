class AppointmentReminderMailer < ApplicationMailer
    default from: Rails.application.credentials.gmailsmtp[:username]

    def reminder_email(appointment)
        @appointment = appointment
        mail(to: @appointment.patient.email, from: Rails.application.credentials.gmailsmtp[:clinicinbox], :subject => "MS Dental clinic service appointment reminder")
    end
end
