export const CLAIM_PENDING_STATUS = "PENDING" as const;
export const CLAIM_APPROVED_STATUS = "APPROVED" as const;
export const CLAIM_REJECTED_STATUS = "REJECTED" as const;

export type ClaimStatus =
  | typeof CLAIM_PENDING_STATUS
  | typeof CLAIM_APPROVED_STATUS
  | typeof CLAIM_REJECTED_STATUS;

export const PAYMENT_PENDING_STATUS = "PENDING" as const;
export const PAYMENT_APPROVED_STATUS = "APPROVED" as const;
export const PAYMENT_REJECTED_STATUS = "REJECTED" as const;

export type PaymentStatus =
  | typeof PAYMENT_PENDING_STATUS
  | typeof PAYMENT_APPROVED_STATUS
  | typeof PAYMENT_REJECTED_STATUS;

export type TransitionResult =
  | { success: true }
  | { success: false; error: string; statusCode: number };

function buildTransitionResult(entity: string, error: string, statusCode: number): TransitionResult {
  return { success: false, error: `${entity} ${error}`, statusCode };
}

function validateFinalTransition(
  entity: string,
  currentStatus: string | null | undefined,
  targetStatus: "APPROVED" | "REJECTED"
): TransitionResult {
  if (!currentStatus) {
    return buildTransitionResult(entity, "not found.", 404);
  }

  if (currentStatus === CLAIM_PENDING_STATUS || currentStatus === PAYMENT_PENDING_STATUS) {
    return { success: true };
  }

  if (currentStatus === targetStatus) {
    return buildTransitionResult(
      entity,
      targetStatus === "APPROVED" ? "already approved." : "already rejected.",
      409
    );
  }

  if (currentStatus === CLAIM_APPROVED_STATUS || currentStatus === PAYMENT_APPROVED_STATUS) {
    return buildTransitionResult(entity, "already approved.", 409);
  }

  if (currentStatus === CLAIM_REJECTED_STATUS || currentStatus === PAYMENT_REJECTED_STATUS) {
    return buildTransitionResult(entity, "already rejected.", 409);
  }

  return buildTransitionResult(entity, "has an invalid status transition.", 400);
}

export function validateClaimTransition(
  currentStatus: string | null | undefined,
  targetStatus: "APPROVED" | "REJECTED"
): TransitionResult {
  return validateFinalTransition("Claim", currentStatus, targetStatus);
}

export function validatePaymentTransition(
  currentStatus: string | null | undefined,
  targetStatus: "APPROVED" | "REJECTED"
): TransitionResult {
  return validateFinalTransition("Payment", currentStatus, targetStatus);
}
