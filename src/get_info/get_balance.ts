import { PublicKey } from "@solana/web3.js";
import { pub_wallet_connection } from "../client/pub_wallet_connect";

const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// Изменяем интерфейс, так как SOL мы больше не запрашиваем
export interface TokenBalances {
  usdc: number;  // Баланс USDC
  token: number; // Баланс торгуемого токена
}

/**
 * Получает балансы ВСЕХ SPL-токенов за 1 запрос и выбирает нужные
 */
export async function getAssetBalances(
  walletAddress: string,
  tokenMintAddress: string,
): Promise<TokenBalances> {
  try {
    const walletPubKey = new PublicKey(walletAddress);

    // 1. Делаем ровно 1 запрос к Helium RPC для получения ВСЕХ токенов кошелька
    const response = await pub_wallet_connection.getParsedTokenAccountsByOwner(
      walletPubKey,
      { programId: TOKEN_PROGRAM_ID }
    );

    let usdcBalance = 0;
    let tokenBalance = 0;

    // Ничего страшного, если у кошелька вообще нет токен-аккаунтов
    if (!response || !response.value) {
      return { usdc: 0, token: 0 };
    }

    // 2. Локально перебираем массив в памяти (без новых запросов в сеть)
    for (const accountInfo of response.value) {
      const parsedInfo = accountInfo.account.data.parsed.info;
      const mint = parsedInfo.mint; // Адрес минта текущего токена в цикле
      const uiAmount = Number(parsedInfo.tokenAmount.uiAmount || 0);

      if (mint === USDC_MINT) {
        usdcBalance = uiAmount;
      } else if (mint === tokenMintAddress) {
        tokenBalance = uiAmount;
      }
    }

    return {
      usdc: usdcBalance,
      token: tokenBalance,
    };

  } catch (error) {
    console.error("Критическая ошибка при запросе всех SPL-токенов с RPC:", error);
    throw error;
  }
}
