class CreatePatients < ActiveRecord::Migration[6.0]
  def change
    create_table :patients do |t|
      t.integer :ApplicantID
      t.string :DoctorName
      t.string :Feedback

      t.timestamps
    end
  end
end
