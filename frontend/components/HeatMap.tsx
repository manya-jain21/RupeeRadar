import MiniTrailGraph from './MiniTrailGraph';

// ...inside the predictions.map CircleMarker:
<Popup minWidth={240}>
  <div className="p-1">
    <p className="font-heading font-bold text-blue mb-1 text-xs uppercase">High Risk ATM</p>
    <p className="text-xs mb-1">Bank: {pred.bank}</p>
    <p className="text-xs mb-2">Risk Score: {pred.risk_score}</p>

    {pred.mule_account_chain && (
      <>
        <p className="text-[10px] uppercase text-slate-400 mb-1 tracking-wide">Money Trail</p>
        <MiniTrailGraph
          chain={pred.mule_account_chain.split(',')}
          targetLabel={`ATM: ${pred.bank}`}
        />
      </>
    )}
  </div>
</Popup>