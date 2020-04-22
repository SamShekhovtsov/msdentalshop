class DoctorsController < ApplicationController
  def index
    @doctors = Doctor.all
  end

  def show
    @doctor = Doctor.find(params[:id])
  end
  
  def new
    @doctor = Doctor.new
  end

  def create
    @doctor = Doctor.new(doctor_params)

    if @doctor.save
      flash[:notice] = 'Doctor profile was successfully created.'
      redirect_to @doctor
    else
      flash[:error] = 'Error while trying to create doctor profile.'
      render "new"
    end
  end

  def edit
    @doctor = Doctor.find(params[:id])
  end

  def update
    @doctor = Doctor.find(params[:id])
  
    if @doctor.update(doctor_params)
      redirect_to @doctor
    else
      render 'edit'
    end
  end

  def destroy
    @doctor = Doctor.find(params[:id])
    @doctor.destroy

    redirect_to doctors_path
  end

  private
    def doctor_params
      params.require(:doctor).permit(:name, :level, :profilephotourl, :birthdate, :biography, :practicestartyear)
    end

end
