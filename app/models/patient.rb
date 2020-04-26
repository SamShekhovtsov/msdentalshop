class Patient < ApplicationRecord
    has_many :appointments, dependent: :destroy
    validates :name, presence: true, length: { minimum: 5 }
end
