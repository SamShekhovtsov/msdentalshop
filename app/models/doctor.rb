class Doctor < ApplicationRecord
    validates :name, presence: true, length: { minimum: 5 }
    validates :level, presence: true, length: { minimum: 3 }
    validates :profilephotourl, presence: true, length: { minimum: 10 }
    validates :birthdate, presence: true
    validates :biography, presence: true, length: { minimum: 10 }
    validates :practicestartyear, presence: true
end
