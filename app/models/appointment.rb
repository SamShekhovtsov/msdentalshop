class Appointment < ApplicationRecord
    validates :date, presence: true
end
