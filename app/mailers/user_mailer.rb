class UserMailer < ApplicationMailer
    default from: Rails.application.credentials.gmailsmtp[:username]

    def contact_email(contact)
        @contact = contact
        mail(to: Rails.application.credentials.gmailsmtp[:clinicinbox], from: @contact.email, :subject => "MS Dental clinic service appointment request") # Rails.application.secrets.owner_email
    end
end
