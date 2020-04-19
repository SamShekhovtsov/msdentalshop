class AddDoctorRefToAppointments < ActiveRecord::Migration[6.0]
  def change
    add_reference :appointments, :doctor, null: true, foreign_key: true
  end
end
