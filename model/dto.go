package model

type TokenDto struct {
	Access  string `json:"access"`
	Refresh string `json:"refresh"`
}

type PersonDetailDto struct {
	ID    uint64  `json:"id"`
	Name  string  `json:"name"`
	Count uint64  `json:"count"`
	Total float64 `json:"total"`
}
