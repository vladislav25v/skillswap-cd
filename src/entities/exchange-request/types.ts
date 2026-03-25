export type ExchangeRequestStatus = 'pending' | 'in_progress' | 'rejected' | 'completed';

export interface ExchangeRequest {
  id: number;
  skillId: number;
  ownerUserId: number;
  requesterUserId: number;
  status: ExchangeRequestStatus;
  createdAt: string;
  respondedAt: string | null;
  completedAt: string | null;
}
