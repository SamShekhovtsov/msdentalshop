require 'test_helper'

class AppointmentTest < ActiveSupport::TestCase
  test "should not make appointments without appointment date" do
    appointment = Appointment.new
    assert_not appointment.save, "Created appointment without appointment date"
  end
end
