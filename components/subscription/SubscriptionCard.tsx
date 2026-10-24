"use client";

import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useTokenBalance } from "@/hooks/useToken";
import { describeInterval } from "@/lib/format";
import { AddressLink } from "@/components/ui/AddressLink";
import { TokenAmount } from "@/components/ui/TokenAmount";
import type { Subscription } from "@/types";
import { CancelButton } from "./CancelButton";
import { CapProgress } from "./CapProgress";
import { NextChargeCountdown } from "./NextChargeCountdown";
import { PauseResumeButton } from "./PauseResumeButton";
import { SubStatusBadge } from "./SubStatusBadge";

/**
 * One subscription as its subscriber sees it. Pause and cancel sit on the
 * card itself, so stopping a subscription is never more than one click away.
 */
export function SubscriptionCard({ sub, onChanged }: { sub: Subscription; onChanged: () => void }) {
  const { address } = useWallet();
  const balance = useTokenBalance(sub.token, address);

  const balanceTooLow =
    balance.data !== null && balance.data !== undefined && balance.data < sub.amountPerPeriod;

  return (
    <article className="card space-y-5 p-5" aria-label={`Subscription ${sub.id}`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-fg">
            <TokenAmount token={sub.token} value={sub.amountPerPeriod} />
            <span className="ml-2 text-sm font-normal text-muted">{describeInterval(sub.intervalLedgers)}</span>
          </h3>
          <p className="text-sm text-muted">
            to <AddressLink address={sub.merchant} />
            {sub.planId > 0 && (
              <>
                {" "}
                ·{" "}
                <Link href={`/plans/${sub.planId}`} className="hover:text-fg hover:underline">
                  plan #{sub.planId}
                </Link>
              </>
            )}
            <span> · subscription #{sub.id}</span>
          </p>
        </div>
        <SubStatusBadge status={sub.status} />
      </header>

      {balanceTooLow && (
        <div className="rounded bg-warn/10 p-3 text-sm text-warn">
          <p className="font-medium">Insufficient balance</p>
          <p>Your balance is too low to cover the next charge. Top up to avoid failed payments.</p>
        </div>
      )}

      <CapProgress sub={sub} />
      <NextChargeCountdown sub={sub} />

      <footer className="flex flex-wrap items-start gap-3 border-t border-line pt-4">
        <PauseResumeButton sub={sub} onDone={onChanged} />
        <CancelButton sub={sub} onDone={onChanged} />
      </footer>
    </article>
  );
}
