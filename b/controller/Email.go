package controller

import (
	"math/rand"
	"net/http"
	"net/smtp"
	"os"
	"strconv"
	"time"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func SendMessage(message string, recipientEmails []string) error {
	broadcaster := smtp.PlainAuth(
		"",
		"oldegg.official1@gmail.com",
		"aoqvsyxgumlpjqgn",
		"smtp.gmail.com")
	err := smtp.SendMail("smtp.gmail.com:587", broadcaster, "oldegg.official1@gmail.com", recipientEmails, []byte(message))
	if err != nil {
		return err
	}

	return nil
}

func Broadcast(c *gin.Context) {
	var message struct {
		Message string
	}

	if c.Bind(&message) != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	emails := []string{}
	config.DB.Model(&model.User{}).Where("email_subscriber = ?", true).Pluck("email", &emails)

	broadcaster := smtp.PlainAuth(
		"",
		"oldegg.official1@gmail.com",
		"aoqvsyxgumlpjqgn",
		"smtp.gmail.com")

	err := smtp.SendMail(
		"smtp.gmail.com:587",
		broadcaster,
		"oldegg.official1@gmail.com",
		emails,
		[]byte(message.Message),
	)

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": "Failed to send email",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Email sent successfully",
	})

}

func generateOTP() (int, time.Time) {
	rand.Seed(time.Now().UnixNano())
	now := time.Now()
	expiration := now.Add(time.Minute * 15)
	otp := rand.Intn(899999) + 100000
	return otp, expiration
}

func sendOTP(email string, otp int) error {
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	smtpUsername := "oldegg.official1@gmail.com"
	smtpPassword := "aoqvsyxgumlpjqgn"

	auth := smtp.PlainAuth("", smtpUsername, smtpPassword, smtpHost)

	message := []byte("To: " + email + "\r\n" +
		"Subject: Old Egg Login OTP Code\r\n" +
		"\r\n" +
		"Your OTP code is " + strconv.Itoa(otp) + ".\r\n" +
		"This code will get expired in 15 minutes" + ".\r\n" +
		"This code is confidential, do not share with anyone")

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, smtpUsername, []string{email}, message)
	if err != nil {
		return err
	}
	return nil
}

func StartOTP(c *gin.Context) {
	var OtpRequest struct {
		Email string `json:"email"`
	}
	c.BindJSON(&OtpRequest)

	var user model.User

	config.DB.First(&user, "email = ?", OtpRequest.Email)

	if user.Email == "" {
		c.String(http.StatusOK, "Cant find the email")
		return
	}

	otp, exp := generateOTP()

	err := sendOTP(user.Email, otp)

	if err != nil {
		c.String(200, "Failed to send OTP")
		return
	}

	// save otp

	var newOTP = model.OTP{
		Code:       uint(otp),
		Email:      user.Email,
		Expiration: exp,
	}

	config.DB.Save(&newOTP)
	c.String(200, "OK")
}

func retrieveOTP(email string) model.OTP {
	var otp model.OTP
	config.DB.First(&otp, "email = ?", email)
	return otp
}

func deleteOTP(otpID uint, c *gin.Context) {
	var otp model.OTP
	config.DB.Where("id = ?", otpID).Delete(&otp)
}

func VerifyOTP(c *gin.Context) {
	var OtpRequest struct {
		Email string `json:"email"`
		OTP   int    `json:"otp"`
	}
	c.ShouldBind(&OtpRequest)

	storedOTP := retrieveOTP(OtpRequest.Email)

	if storedOTP.Code != uint(OtpRequest.OTP) {
		c.String(200, "OTP Code is invalid!")
		return
	}

	if time.Now().After(storedOTP.Expiration) {
		deleteOTP(storedOTP.ID, c)
		c.JSON(200, gin.H{"error": "OTP expired"})
		return
	}

	deleteOTP(storedOTP.ID, c)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": OtpRequest.Email,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": "Failed to generate token",
		})
		return
	}
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("JWToken", tokenString, 3600*24, "", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
	})
}

func generateForgotPass() (int, time.Time) {
	rand.Seed(time.Now().UnixNano())
	now := time.Now()
	expiration := now.Add(time.Minute * 5)
	otp := rand.Intn(899999) + 100000
	return otp, expiration
}

func sendForgotPass(email string, otp int) error {
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	smtpUsername := "oldegg.official1@gmail.com"
	smtpPassword := "aoqvsyxgumlpjqgn"

	auth := smtp.PlainAuth("", smtpUsername, smtpPassword, smtpHost)

	message := []byte("To: " + email + "\r\n" +
		"Subject: Old Egg Forgot Password 1 Time Code\r\n" +
		"\r\n" +
		"Your Forgot Password code is " + strconv.Itoa(otp) + ".\r\n" +
		"This code will get expired in 5 minutes" + ".\r\n" +
		"This code is confidential, do not share with anyone")

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, smtpUsername, []string{email}, message)
	if err != nil {
		return err
	}
	return nil
}

func retrieveForgotPass(email string) model.ForgotPass {
	var otp model.ForgotPass
	config.DB.First(&otp, "email = ?", email)
	return otp
}

func deleteForgotPass(otpID uint, c *gin.Context) {
	var otp model.ForgotPass
	config.DB.Where("id = ?", otpID).Delete(&otp)
}

func VerifyForgotPass(c *gin.Context) {
	var ForgotPassRequest struct {
		Email string `json:"email"`
		OTP   int    `json:"otp"`
	}
	c.ShouldBind(&ForgotPassRequest)

	storedOTP := retrieveForgotPass(ForgotPassRequest.Email)

	if storedOTP.Code != uint(ForgotPassRequest.OTP) {
		c.String(200, "Forgot Pass Code is invalid!")
		return
	}

	if time.Now().After(storedOTP.Expiration) {
		deleteForgotPass(storedOTP.ID, c)
		c.String(200, "Code already expired")
		return
	}

	var currUser model.User

	config.DB.First(&currUser, "email = ?", storedOTP.Email)

	deleteForgotPass(storedOTP.ID, c)
	c.String(200, "OK")

}

func StartForgotPass(c *gin.Context) {
	var OtpRequest struct {
		Email string `json:"email"`
	}
	c.BindJSON(&OtpRequest)

	var user model.User

	config.DB.First(&user, "email = ?", OtpRequest.Email)

	if user.Email == "" {
		c.String(http.StatusOK, "Cant find the email")
		return
	}

	otp, exp := generateForgotPass()

	err := sendForgotPass(user.Email, otp)

	if err != nil {
		c.String(200, "Failed to send Forgot Pass Code")
		return
	}

	// save otp

	var newOTP = model.ForgotPass{
		Code:       uint(otp),
		Email:      user.Email,
		Expiration: exp,
	}

	config.DB.Save(&newOTP)
	c.String(200, "OK")
}
