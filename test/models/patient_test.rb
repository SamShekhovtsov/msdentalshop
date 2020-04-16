require 'test_helper'

class PatientTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

test "should not save patient without ApplicantID" do
  patient = Patient.new
  assert_not patient.save
end