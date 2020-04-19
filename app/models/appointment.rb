class Appointment < ApplicationRecord
    belongs_to :doctor
    belongs_to :patient
    validates :date, presence: true
    validates :doctor, presence: true
    validates :patient, presence: true
end
