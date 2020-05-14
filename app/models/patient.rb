class Patient < ApplicationRecord
    has_many :appointments, dependent: :destroy
    validates :name, presence: true, length: { minimum: 5 }
    validates :email, presence: true, email: true, length: { minimum: 5 }, format: { with: URI::MailTo::EMAIL_REGEXP } 
end
