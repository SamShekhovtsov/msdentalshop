class DoctorsController < ApplicationController
  def index
    @doctors = Doctor.all
end

def show
  @doctors = Doctor.find(params[:id])
end

def new

end

def create
  @doctor = Doctor.new(doctor_params)
 
  @doctor.save
  redirect_to @doctor
end
 
private
  def doctor_params
    params.require(:doctor).permit(:name, :level, :profilephotourl, :birthdate, :biography, :practicestartyear)
  end
end
end
