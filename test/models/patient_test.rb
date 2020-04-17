require 'test_helper'

class PatientTest < ActiveSupport::TestCase
  test "should not save patient without name" do
    patient = Patient.new
    assert_not patient.save, "Saved patient without name"
  end
end
