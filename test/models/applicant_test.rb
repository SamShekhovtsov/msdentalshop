require 'test_helper'

class ApplicantTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end


test "should not save applicant without name" do
  applicant = Applicant.new
  assert_not applicant.save
end