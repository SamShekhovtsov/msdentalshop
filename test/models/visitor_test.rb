require 'test_helper'

describe Visitor do

    let(:visitor_params) { {email: 'user@example.com'} }
    let(:visitor) { Visitor.new visitor_params }

    it 'is valid when created with valid parameters' do
        visitor.must_be :valid?
    end

    it 'is valid without an email' do
        visitor_params.delete :email
        visitor.wont_be :valid?
        visitor.errors[:email].must_be :present?
    end
end