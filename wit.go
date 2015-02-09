package main

import (
	"fmt"
	// "net/http"
	// curl "github.com/andelf/go-curl"
)

import "github.com/go-av/curl"

func main() {

	// header := http.Header{
	// "Authorization": {"Bearer OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA"},
	// }
	_, str := curl.String("http://ya.ru")

	fmt.Print(str)
}
