package models

import (
	"reflect"
	"testing"
)

func TestStringSlice_ValueAndScan_RoundTrip(t *testing.T) {
	orig := StringSlice{"Go", "Kubernetes", "LLMs"}

	v, err := orig.Value()
	if err != nil {
		t.Fatalf("Value: %v", err)
	}

	// Scan from []byte (typical sqlite/postgres driver output).
	var fromBytes StringSlice
	if err := fromBytes.Scan(v.([]byte)); err != nil {
		t.Fatalf("Scan []byte: %v", err)
	}
	if !reflect.DeepEqual(orig, fromBytes) {
		t.Errorf("round trip []byte = %v, want %v", fromBytes, orig)
	}

	// Scan from string.
	var fromStr StringSlice
	if err := fromStr.Scan(string(v.([]byte))); err != nil {
		t.Fatalf("Scan string: %v", err)
	}
	if !reflect.DeepEqual(orig, fromStr) {
		t.Errorf("round trip string = %v, want %v", fromStr, orig)
	}
}

func TestStringSlice_ScanNil(t *testing.T) {
	s := StringSlice{"x"}
	if err := s.Scan(nil); err != nil {
		t.Fatalf("Scan(nil): %v", err)
	}
	if s != nil {
		t.Errorf("Scan(nil) = %v, want nil", s)
	}
}

func TestStringSlice_ScanUnsupported(t *testing.T) {
	var s StringSlice
	if err := s.Scan(42); err == nil {
		t.Error("expected error scanning unsupported int type")
	}
}

func TestStringSlice_ValueEmpty(t *testing.T) {
	v, err := StringSlice{}.Value()
	if err != nil {
		t.Fatalf("Value: %v", err)
	}
	if string(v.([]byte)) != "[]" {
		t.Errorf("empty Value = %s, want []", v.([]byte))
	}
}
