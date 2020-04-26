require 'test_helper'

class DoctorTest < ActiveSupport::TestCase

  # called before every single test
  setup do
    @doctor = doctors(:doctor1)
    @testNewDoctor = doctors(:newDoctor)
  end

  # called after every single test
  teardown do
    # when controller is using cache it may be a good idea to reset it afterwards
    Rails.cache.clear
  end

  test "should not save doctor without required parameteres" do
    doctor = Doctor.new
    assert_not doctor.save, "Saved doctor without required parameteres"
  end

  test "should save doctor with valid parameters" do
    doctorValidAttributes = @doctor.attributes
    doctorValidAttributes.delete("id")
    doctor = Doctor.new(doctorValidAttributes)
    assert doctor.save, "Can't save doctor with valid attributes"
  end

  test "should NOT save doctor with missing attributes" do
    doctorValidAttributes = @doctor.attributes
    doctorValidAttributes.delete("id")
    doctorValidAttributes.delete("level")
    doctor = Doctor.new(doctorValidAttributes)
    assert_not doctor.save, "Saved doctor with missing attributes"
  end

  test "should NOT save doctor with empty attributes" do
    doctorValidAttributes = @doctor.attributes
    doctorValidAttributes.delete("id")
    doctorValidAttributes["level"] = ""
    doctor = Doctor.new(doctorValidAttributes)
    assert_not doctor.save, "Saved doctor with empty attributes"
  end

  test "should NOT save doctor with invalid attributes" do
    doctorValidAttributes = @doctor.attributes
    doctorValidAttributes.delete("id")
    doctorValidAttributes["name"] = "test"
    doctor = Doctor.new(doctorValidAttributes)
    assert_not doctor.save, "Saved doctor with invalid attributes"
  end
end
