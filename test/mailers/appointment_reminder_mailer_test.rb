require 'test_helper'

class AppointmentReminderMailerTest < ActionMailer::TestCase

  def setup
    @appointment = appointments(:appointment1)
  end

  # called after every single test
  teardown do
    # when controller is using cache it may be a good idea to reset it afterwards
    Rails.cache.clear
  end

  test "should send the appointment reminder email" do
    email = AppointmentReminderMailer.reminder_email(@appointment)
    assert_emails 1 do
      email.deliver_later
    end

    assert_equal 1, ActionMailer::Base.deliveries.size
    assert_equal email.to, [@appointment.patient.email]
    assert_equal email.from, [Rails.application.credentials.gmailsmtp[:username]]
    assert_equal email.subject, "MS Dental clinic service appointment reminder"
    #assert_match 'appointment is arranged', email.body.encoded
  end
end
