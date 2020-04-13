class CreateApplicants < ActiveRecord::Migration[6.0]
  def change
    create_table :applicants do |t|
      t.string :name
      t.string :email
      t.string :phone
      t.text :appointment

      t.timestamps
    end
  end
end
