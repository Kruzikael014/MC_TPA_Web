package util

import (
	"regexp"
	"unicode"
)

func IsValidEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

func IsValidPhone(phone string) bool {
	phoneRegex := regexp.MustCompile(`^[0-9]{7,15}$`)
	return phoneRegex.MatchString(phone)
}

func IsValidPassword(password string) bool {
	if len(password) < 8 || len(password) > 30 {
		return false
	}

	var (
		upperCount   int
		lowerCount   int
		digitCount   int
		specialCount int
	)

	for _, c := range password {
		switch {
		case unicode.IsUpper(c):
			upperCount++
		case unicode.IsLower(c):
			lowerCount++
		case unicode.IsDigit(c):
			digitCount++
		case unicode.IsPunct(c) || unicode.IsSymbol(c):
			specialCount++
		}
	}

	if upperCount != 0 && lowerCount != 0 && digitCount != 0 && specialCount != 0 {
		return true
	} else {
		return false
	}

}
