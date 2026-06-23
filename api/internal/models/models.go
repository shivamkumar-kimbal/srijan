package models

import "time"

// Opportunity is a gig/project/challenge/transfer posted on the marketplace.
type Opportunity struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Type        string         `json:"type"` // automation|innovation|cost|docs|techdebt|transfer
	Title       string         `json:"title"`
	Desc        string         `json:"desc"`
	LongDesc    string         `json:"longDesc"`
	Skills      StringSlice    `gorm:"type:text" json:"skills"`
	Match       int            `json:"match"`
	Days        int            `json:"days"`
	Team        string         `json:"team"`
	Proposals   int            `json:"proposals"`
	OwnerName   string         `json:"ownerName"`
	OwnerDept   string         `json:"ownerDept"`
	OwnerInit   string         `json:"ownerInitials"`
	RewardBig   string         `json:"rewardBig"`
	RewardLabel string         `json:"rewardLabel"`
	MatchPct    string         `json:"matchPct"`
	RewardChips StringSlice    `gorm:"type:text" json:"rewardChips"`
	Roles       []Role         `gorm:"foreignKey:OpportunityID" json:"roles"`
	CreatedAt   time.Time      `json:"createdAt"`
}

// Role is an open/filled seat on an opportunity team.
type Role struct {
	ID            uint   `gorm:"primaryKey" json:"-"`
	OpportunityID uint   `json:"-"`
	Name          string `json:"name"`
	Status        string `json:"status"` // open|filled
	Slots         string `json:"slots"`
}

// Proposal is an employee's bid to join an opportunity.
type Proposal struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	OpportunityID uint      `json:"opportunityId"`
	AuthorName    string    `json:"authorName"`
	Why           string    `json:"why"`
	Experience    string    `json:"experience"`
	WeeklyHours   int       `json:"weeklyHours"`
	Status        string    `json:"status"` // submitted|accepted|rejected
	CreatedAt     time.Time `json:"createdAt"`
}
