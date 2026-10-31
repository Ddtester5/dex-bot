import { analyzeMarket } from "./analize_market";
import type { DexCoinConfig } from "./config";
import { getAssetBalances } from "./get_info/get_balance";
import { getActiveLimitPositions } from "./get_info/get_positions";
import { sleep } from "./utits/sleep";
import "dotenv/config";

const WALLET_PUB_ADRESS = process.env.WALLET_PUB_ADRESS || "";
export async function tradeLoop(config: DexCoinConfig) {
  const {
    SYMBOL,
    TOKEN_MINT,
    POOL_ADDRESS,
    TRADE_INTERVAL_MS,
    BUY_RANGE,
    SELL_RANGE,
    USDC_QUANTITY,
  } = config;

  console.log(`🚀 Робот запущен для пары ${SYMBOL} в Stateless-режиме.`);

  while (true) {
    try {
      // ==========================================
      // 1. СБОР СВЕЖИХ ДАННЫХ С СЕРВЕРА
      // ==========================================
      const market = await analyzeMarket(config);
      console.log(market);
      if (!market) continue;

      const balance = await getAssetBalances(WALLET_PUB_ADRESS, TOKEN_MINT);
      console.log(balance);
      if (balance.token === null || balance.usdc === null) {
        console.log(
          `⚠️ [${SYMBOL}] Не удалось собрать все данные с биржи. Пропускаем тик...`,
        );
        await sleep(TRADE_INTERVAL_MS);
        continue;
      }

      console.log(`[Сетка] Сканируем активные позиции в пуле ${SYMBOL}...`);
      const activeOrders = await getActiveLimitPositions(
        POOL_ADDRESS,
        WALLET_PUB_ADRESS,
      );

      if (activeOrders.length === 0) {
        console.log(
          `[Сетка] У вас нет открытых лимитных позиций на смарт-контракте.`,
        );
      } else {
        console.log(
          `[Сетка] Найденные открытые ордера (${activeOrders.length}):`,
        );
        console.dir(activeOrders, { depth: null });
      }
      const currentPrice = market.currentPrice;
      const coinValueInUsdc = balance.token * currentPrice;
      // const usdtToBuyOrders = currentBuyOrder.reduce(
      //   (sum: number, order: { origQty: string; price: string }) =>
      //     sum + Number(order.origQty) * Number(order.price),
      //   0,
      // );
      // const usdtToSellOrders = currentSellOrder.reduce(
      //   (sum: number, order: { origQty: string; price: string }) =>
      //     sum + Number(order.origQty) * Number(order.price),
      //   0,
      // );
      // ==========================================
      // 2. АНАЛИЗ СОСТОЯНИЯ И ПРИНЯТИЕ РЕШЕНИЙ
      // ==========================================
      //     if (coinValueInUsdt >= MIN_NOTIONAL) {
      //       const buyPrice = await getLastBuyPrice(SYMBOL);

      //       const stopPrice = Number(buyPrice) * (1 - STOP_LOSS_PCT / 100);
      //       if (currentPrice <= stopPrice) {
      //         console.log(
      //           `🚨 [${SYMBOL}] СТОП-ЛОСС! Цена ${currentPrice} <= ${stopPrice}. Экстренно выходим по рынку.`,
      //         );
      //         for (const order of currentBuyOrder) {
      //           await cancelOrder(order.orderId, SYMBOL);
      //         }
      //         for (const order of currentSellOrder) {
      //           await cancelOrder(order.orderId, SYMBOL);
      //         }
      //         await placeMarketSell(coinBalance, SYMBOL);
      //         console.log(`😴 [${SYMBOL}] Пауза после стоп-лосса.`);
      //         await sleep(INTERVAL_AFTER_STOPLOSS_MS);
      //         continue;
      //       }
      //     }
      //     if (currentBuyOrder.length > 0) {
      //       for (const order of currentBuyOrder) {
      //         const buyAgeMinutes = Date.now() - order.time;
      //         if (buyAgeMinutes >= ORDER_TIMEOUT_MS) {
      //           console.log(
      //             `⏰ [${SYMBOL}] Ордер BUY висит больше 3 минут без полного налива. Отменяем.`,
      //           );
      //           await cancelOrder(order.orderId, SYMBOL);
      //         }
      //       }
      //     }

      //     if (currentSellOrder.length > 0) {
      //       for (const order of currentSellOrder) {
      //         const tpAge = Date.now() - order.time;
      //         if (tpAge >= ORDER_TIMEOUT_MS) {
      //           console.log(
      //             `⏰ [${SYMBOL}] ТР висит больше 3 минут. Отменяем для перестановки по новому каналу.`,
      //           );
      //           await cancelOrder(order.orderId, SYMBOL);
      //         }
      //       }
      //     }

      //     if (coinValueInUsdt >= MIN_NOTIONAL) {
      //       let targetSellPrice =
      //         market.localMinPrice + market.localRange * SELL_RANGE;
      //       const minAllowedSellPrice = market.currentPrice + PRICE_STEP;
      //       if (targetSellPrice < minAllowedSellPrice) {
      //         targetSellPrice = minAllowedSellPrice;
      //       }
      //       const sellOrder = await placeLimitOrder(
      //         "SELL",
      //         targetSellPrice,
      //         coinBalance.toString(),
      //         SYMBOL,
      //         PRICE_STEP,
      //       );
      //       if (sellOrder?.orderId) {
      //         console.log(
      //           `💰 [${SYMBOL}] Выставлен Тейк-Профит на ${coinBalance} ${ASSET_NAME} по цене ${targetSellPrice}`,
      //         );
      //       }
      //     }

      //     if (usdtBalance >= MIN_NOTIONAL && market.isSideways) {
      //       const usdt_to_trade =
      //         Math.min(usdtBalance, USDT_QUANTITY) -
      //         usdtToBuyOrders -
      //         usdtToSellOrders -
      //         coinValueInUsdt;
      //       if (usdt_to_trade < MIN_NOTIONAL) {
      //         await sleep(TRADE_INTERVAL_MS);
      //         continue;
      //       }
      //       const coinQty = (usdt_to_trade * 0.99) / market.currentPrice;
      //       const decimals_qty = QTY_STEP.toString().split(".")[1]?.length || 0;
      //       const formatedQty = coinQty.toFixed(decimals_qty);
      //       let targetBuyPrice =
      //         market.localMinPrice + market.localRange * BUY_RANGE;
      //       const maxAllowedBuyPrice = market.currentPrice - PRICE_STEP;
      //       if (targetBuyPrice > maxAllowedBuyPrice) {
      //         targetBuyPrice = maxAllowedBuyPrice;
      //       }
      //       console.log(
      //         `📈 [${SYMBOL}] Выставляем ордер BUY на ${formatedQty} ${ASSET_NAME} по цене ${targetBuyPrice}`,
      //       );
      //       const order = await placeLimitOrder(
      //         "BUY",
      //         targetBuyPrice,
      //         formatedQty,
      //         SYMBOL,
      //         PRICE_STEP,
      //       );
      //       if (order?.orderId) {
      //         console.log(
      //           `🛒 [${SYMBOL}] Выставили новый ордер BUY по цене ${targetBuyPrice}`,
      //         );
      //       }
      //     }
    } catch (error) {
      console.error(`💥 Критическая ошибка в цикле тика для ${SYMBOL}:`, error);
    }

    await sleep(TRADE_INTERVAL_MS);
  }
}
