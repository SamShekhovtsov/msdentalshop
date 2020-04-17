require 'test_helper'

class DoctorTest < ActiveSupport::TestCase
  test "should not save doctor without name" do
    doctor = Doctor.new
    assert_not doctor.save, "Saved doctor without name"
  end
end
