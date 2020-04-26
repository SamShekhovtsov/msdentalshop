require 'test_helper'

class AppointmentTest < ActiveSupport::TestCase
  test "should not make appointments without appointment date" do
    appointment = Appointment.new
    assert_not appointment.save, "Created appointment without appointment date"
  end

  test "should schedule an appointment with valid parameters" do

    appointment = Appointment.new(@appointment.attributes.delete :id)
    assert appointment.save, "Can't save an appointment"
  end
end
