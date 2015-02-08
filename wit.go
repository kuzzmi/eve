package main

import (
	"fmt"
	"net/http"
	// curl "github.com/andelf/go-curl"
)

import "github.com/go-av/curl"

func main() {

	header := http.Header{
		"Authorization": {"Bearer OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA"},
	}
	_, str := curl.String("https://api.wit.ai/message?v=20141022&q=hello", header)

	fmt.Print(str)
}
