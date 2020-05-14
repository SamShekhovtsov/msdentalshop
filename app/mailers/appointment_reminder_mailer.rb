class AppointmentReminderMailer < ApplicationMailer
    default from: Rails.application.credentials.gmailsmtp[:username]

    def reminder_email(appointment)
        @appointment = appointment
        #Rails.application.config.action_mailer[:default_url_options][:host] = 'myproduction.com'
        Rails.application.routes.default_url_options[:host] =  'myproduction.com'
        mail(to: @appointment.patient.email, :subject => "MS Dental clinic service appointment reminder")
    end
end
