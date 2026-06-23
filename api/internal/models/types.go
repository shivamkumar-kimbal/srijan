package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// StringSlice persists a []string as a JSON text column (works on sqlite & postgres).
type StringSlice []string

func (s StringSlice) Value() (driver.Value, error) {
	return json.Marshal(s)
}

func (s *StringSlice) Scan(v any) error {
	if v == nil {
		*s = nil
		return nil
	}
	switch b := v.(type) {
	case []byte:
		return json.Unmarshal(b, s)
	case string:
		return json.Unmarshal([]byte(b), s)
	default:
		return errors.New("StringSlice: unsupported scan type")
	}
}
