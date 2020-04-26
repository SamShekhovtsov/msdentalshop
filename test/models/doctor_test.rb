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

  test "should not save doctor without name" do
    doctor = Doctor.new
    assert_not doctor.save, "Saved doctor without name"
  end

  test "should save doctor with valid parameters" do
    doctorValidAttributes = @doctor.attributes
    doctorValidAttributes.delete("id")
    doctor = Doctor.new(doctorValidAttributes)
    assert doctor.save, "Can't save doctor with valid attributes"
  end
end
