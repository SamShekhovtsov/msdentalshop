require 'test_helper'

class PatientTest < ActiveSupport::TestCase

  # called before every single test
  setup do
    @patient = patients(:patient1)
    @testNewPatient = patients(:newPatient)
  end

  # called after every single test
  teardown do
    # when controller is using cache it may be a good idea to reset it afterwards
    Rails.cache.clear
  end

  test "should not save patient without name" do
    patient = Patient.new
    assert_not patient.save, "Saved patient without name"
  end

  test "should save patient with valid parameters" do

    patient = Patient.new(@patient.attributes.delete :id)
    assert patient.save, "Saved patient successfully"
  end
end
