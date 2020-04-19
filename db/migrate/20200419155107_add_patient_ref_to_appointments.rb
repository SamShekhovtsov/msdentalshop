class AddPatientRefToAppointments < ActiveRecord::Migration[6.0]
  def change
    add_reference :appointments, :patient, null: false, foreign_key: true
  end
end
