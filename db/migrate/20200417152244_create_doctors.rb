class CreateDoctors < ActiveRecord::Migration[6.0]
  def change
    create_table :doctors do |t|
      t.string :name
      t.string :level
      t.string :profilephotourl
      t.datetime :birthdate
      t.text :biography
      t.integer :practicestartyear

      t.timestamps
    end
  end
end
