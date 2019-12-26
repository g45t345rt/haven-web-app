import {EmptyState, History, Message, NoTransactions} from "shared/pages/_wallet/details/styles";
import {Spinner} from "shared/components/spinner";
import {convertBalanceForReading, createRemainingTimeString} from "utility/utility";
import empty from "assets/illustration/no_transactions.svg";
import React, {Component} from "react";
import {getTransfers} from "../../actions";
import {connect} from "react-redux";
import {Transaction} from "shared/components/transaction";
import Header from "shared/components/_layout/header/index.js";
import {selectBlockHeight} from "../../reducers/chain";
import {getTransferListByTicker} from "shared/reducers/xTransferList";
import {withRouter} from "react-router";
import {Ticker} from "shared/reducers/types";
import {DesktopAppState} from "platforms/desktop/reducers";


interface TxHistoryProps {

  transferList:any[] | null;
  height: number;
  price: number;
  assetId: Ticker;
  getTransfers: () => void;

}


class TxHistoryContainer extends Component<TxHistoryProps, any> {
  getTransactionType(direction: string, type: string) {
    if (direction === "in" && type === "block") {
      return "Mined";
    } else if (direction === "out") {
      return "Sent";
    } else if (direction === "in") {
      return "Received";
    } else {
      return direction;
    }
  }


  getCurrentValueInUSD = (amount: number, ticker: Ticker ) => {

    const humanAmount: number = convertBalanceForReading(Math.abs(amount));

    switch (ticker) {

      case Ticker.xUSD:
        return humanAmount;
      case Ticker.XHV:
        return humanAmount * this.props.price;

    }
  };


  render() {
    const all = this.props.transferList;
    const isFetching = false;
    const currentHeight = this.props.height;

    return (
      <>
        <Header
          title="History"
          description={`Review your ${this.props.assetId} transaction history`}
        />
        {isFetching && all == null ? (
          <EmptyState>
            <Spinner />
            <Message>Loading transaction history...</Message>
          </EmptyState>
        ) : (
          <History>
            {all && all.length > 0 ? (
              all.map((transaction: any, index: number) => {

                const currentValueInUSD = this.getCurrentValueInUSD(transaction.amount, this.props.assetId);
                const transactionDate = new Date(transaction.timestamp * 1000).toLocaleDateString();
                const isMempool = transaction.direction === 'pending' || transaction.direction === 'pool';
                const readableAmount = convertBalanceForReading(transaction.amount);
                const txType = this.getTransactionType(transaction.direction, transaction.type);

                let blocksTillUnlocked: number = 0;
                  if (transaction.unlock_time > transaction.height) {
                    if (transaction.unlock_time > currentHeight) {
                      blocksTillUnlocked = transaction.unlock_time - currentHeight;
                    }
                  }
                  else{

                    blocksTillUnlocked = transaction.unlock_time - transaction.confirmations;
                  }
                  const minutesTillUnlocked = blocksTillUnlocked * 2;
                  const timeTillUnlocked = minutesTillUnlocked > 0? createRemainingTimeString(minutesTillUnlocked): null;



                return (
                  <Transaction
                    key={index}
                    type={txType}
                    status={transaction.direction}
                    currentValueInUSD={currentValueInUSD}
                    block={transaction.height}
                    date={transactionDate}
                    tx={transaction.txid}
                    mempool={isMempool}
                    amount={readableAmount}
                    timeTillUnlocked={timeTillUnlocked}
                  />
                );
              })
            ) : (
              <EmptyState>
                <NoTransactions src={empty} />
                <Message>
                  No transactions found. Once you send, receive or exchange
                  tokens your transactions will appear here.
                </Message>
              </EmptyState>
            )}
          </History>
        )}
      </>
    );
  }
}

export const mapStateToProps = (state: DesktopAppState, props: any) => ({
  transferList: getTransferListByTicker(state, props.match.params.id),
  height: selectBlockHeight(state),
  price: state.simplePrice.price
});

export const TxHistoryDesktop = withRouter(
  connect(
    mapStateToProps,
    { getTransfers }
  )(TxHistoryContainer)
);
