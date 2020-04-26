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

  test "should NOT save patient without name" do
    patient = Patient.new
    assert_not patient.save, "Saved patient without name"
  end

  test "should save patient with valid parameters" do
    patientValidAttributes = @patient.attributes
    patientValidAttributes.delete("id")
    patient = Patient.new(patientValidAttributes)
    assert patient.save, "Can't save patient with valid attributes"
  end

  test "should NOT save patient with missing attributes" do
    patientValidAttributes = @patient.attributes
    patientValidAttributes.delete("id")
    patientValidAttributes.delete("name")
    patient = Patient.new(patientValidAttributes)
    assert_not patient.save, "Saved patient with missing attributes"
  end

  test "should NOT save patient with empty attributes" do
    patientValidAttributes = @patient.attributes
    patientValidAttributes.delete("id")
    patientValidAttributes["name"] = ""
    patient = Patient.new(patientValidAttributes)
    assert_not patient.save, "Saved patient with empty attributes"
  end

  test "should NOT save patient with invalid attributes" do
    patientValidAttributes = @patient.attributes
    patientValidAttributes.delete("id")
    patientValidAttributes["name"] = "test"
    patient = Patient.new(patientValidAttributes)
    assert_not patient.save, "Saved patient with invalid attributes"
  end
end
