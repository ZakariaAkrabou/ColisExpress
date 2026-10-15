import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';
import { Colis } from '../colis/create-colis';
import { CityColisGroup, CityGroupingMode } from './colisByCity';

/**
 * Generate CSS styles for high-quality printing with strict page breaks between cities.
 */
function getPrintCSS(): string {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      
      @page {
        size: A4 portrait;
        margin: 12mm 10mm;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #0f172a;
        background: #ffffff;
        font-size: 11px;
        line-height: 1.4;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .city-page {
        padding: 0 0 10px 0;
      }

      .page-break {
        page-break-before: always !important;
        break-before: page !important;
      }

      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #1d4ed8;
        padding-bottom: 12px;
        margin-bottom: 14px;
      }

      .brand-title {
        font-size: 20px;
        font-weight: 800;
        color: #1d4ed8;
        letter-spacing: -0.5px;
      }

      .brand-subtitle {
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .doc-meta {
        text-align: right;
      }

      .doc-type-badge {
        display: inline-block;
        background: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .doc-date {
        color: #64748b;
        font-size: 10px;
      }

      /* City Hero Banner */
      .city-banner {
        background: #f8fafc;
        border: 1.5px solid #cbd5e1;
        border-left: 5px solid #1d4ed8;
        border-radius: 8px;
        padding: 10px 14px;
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .city-name {
        font-size: 16px;
        font-weight: 800;
        color: #0f172a;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .city-stats {
        display: flex;
        gap: 16px;
      }

      .city-stat-item {
        text-align: right;
      }

      .city-stat-label {
        font-size: 9px;
        color: #64748b;
        text-transform: uppercase;
        font-weight: 600;
      }

      .city-stat-val {
        font-size: 13px;
        font-weight: 700;
        color: #1d4ed8;
      }

      /* Parcels Table */
      table.parcels-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
      }

      table.parcels-table th {
        background-color: #f1f5f9;
        color: #334155;
        font-weight: 700;
        text-align: left;
        padding: 8px 6px;
        font-size: 10px;
        text-transform: uppercase;
        border-top: 1px solid #cbd5e1;
        border-bottom: 2px solid #cbd5e1;
      }

      table.parcels-table td {
        padding: 7px 6px;
        border-bottom: 1px solid #e2e8f0;
        font-size: 10.5px;
        vertical-align: top;
      }

      table.parcels-table tr:nth-child(even) {
        background-color: #f8fafc;
      }

      .tracking-badge {
        font-family: monospace;
        font-weight: 700;
        color: #1d4ed8;
        background: #dbeafe;
        padding: 2px 5px;
        border-radius: 4px;
        display: inline-block;
      }

      .contact-name {
        font-weight: 600;
        color: #0f172a;
      }

      .contact-phone {
        font-size: 9.5px;
        color: #64748b;
      }

      .badge-paid {
        background: #dcfce7;
        color: #15803d;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 700;
        font-size: 9px;
        display: inline-block;
      }

      .badge-unpaid {
        background: #fee2e2;
        color: #b91c1c;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 700;
        font-size: 9px;
        display: inline-block;
      }

      .badge-status {
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 9px;
        font-weight: 600;
        display: inline-block;
      }
      .badge-pending { background: #fef3c7; color: #b45309; }
      .badge-transit { background: #e0e7ff; color: #4338ca; }
      .badge-delivered { background: #dcfce7; color: #15803d; }

      /* Summary Box & Signatures */
      .summary-section {
        display: flex;
        justify-content: space-between;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 10px 14px;
        margin-top: auto;
      }

      .signature-box {
        width: 46%;
        border-top: 1px dashed #94a3b8;
        margin-top: 25px;
        padding-top: 4px;
        font-size: 9.5px;
        color: #475569;
        text-align: center;
      }

      .footer-bar {
        margin-top: 10px;
        border-top: 1px solid #e2e8f0;
        padding-top: 6px;
        display: flex;
        justify-content: space-between;
        font-size: 9px;
        color: #94a3b8;
      }
    </style>
  `;
}

/**
 * Format date string nicely.
 */
function getFormattedDateTime(): string {
  const d = new Date();
  const dateStr = d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeStr = d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${dateStr} à ${timeStr}`;
}

/**
 * Render HTML for one single city page.
 */
function renderSingleCityPageHTML(
  group: CityColisGroup,
  isFirst: boolean,
  pageIndex: number,
  totalPages: number,
  mode: CityGroupingMode,
  direction?: 'MA_TO_FR' | 'FR_TO_MA'
): string {
  const directionText = direction === 'FR_TO_MA' ? 'France ➔ Maroc' : 'Maroc ➔ France';
  const modeLabel = mode === 'origin' ? 'Ville de départ (Origine)' : 'Ville d’arrivée (Destination)';

  const tableRows = group.colis
    .map((colis, idx) => {
      const isPaid = colis.isPaid !== false;
      const otherCity = mode === 'origin' ? colis.toCity : colis.fromCity;
      const statusClass =
        colis.status === 'delivered'
          ? 'badge-delivered'
          : colis.status === 'in_transit'
          ? 'badge-transit'
          : 'badge-pending';
      const statusLabel =
        colis.status === 'delivered'
          ? 'Livré'
          : colis.status === 'in_transit'
          ? 'En transit'
          : 'En attente';

      return `
        <tr>
          <td style="width: 25px; color: #64748b;">${idx + 1}</td>
          <td style="width: 85px;">
            <span class="tracking-badge">${colis.id}</span>
            <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">
              ${colis.isADomicile !== false ? ' Domicile' : ' Relais'}
            </div>
          </td>
          <td>
            <div class="contact-name">${colis.senderName}</div>
            <div class="contact-phone"> ${colis.senderPhone}</div>
            <div style="font-size: 9px; color: #475569;"> ${colis.fromCity}</div>
          </td>
          <td>
            <div class="contact-name">${colis.receiverName}</div>
            <div class="contact-phone"> ${colis.receiverPhone}</div>
            <div style="font-size: 9px; color: #475569;"> ${colis.toCity}</div>
          </td>
          <td style="text-align: right; width: 60px;">
            <strong>${colis.weight} kg</strong>
            <div style="font-size: 8.5px; color: #64748b;">${colis.quantity || 1} pcs</div>
          </td>
          <td style="text-align: right; width: 75px;">
            <strong>${colis.price} MAD</strong>
            <div>
              <span class="${isPaid ? 'badge-paid' : 'badge-unpaid'}">
                ${isPaid ? 'PAYÉ' : 'À ENCAISSER'}
              </span>
            </div>
          </td>
         
        </tr>
      `;
    })
    .join('');

  return `
    <div class="city-page ${!isFirst ? 'page-break' : ''}">
      <div>
        <!-- Document Header -->
        <div class="header-container">
          <div>
            <div class="brand-title"> COLIS EXPRESS</div>
            <div class="brand-subtitle">Feuille de Route & Bordereau de Livraison (${directionText})</div>
          </div>
          <div class="doc-meta">
            <div class="doc-type-badge">PAGE VILLE : ${group.city.toUpperCase()}</div>
            <div class="doc-date">Généré le ${getFormattedDateTime()}</div>
          </div>
        </div>

        <!-- City Hero Card -->
        <div class="city-banner">
          <div>
            <div class="city-name">
              <span> Ville :</span>
              <span>${group.city}</span>
            </div>
            <div style="font-size: 9.5px; color: #64748b; margin-top: 2px;">
              ${modeLabel} • Regroupement spécifique à cette ville
            </div>
          </div>
          <div class="city-stats">
            <div class="city-stat-item">
              <div class="city-stat-label">Total Colis</div>
              <div class="city-stat-val">${group.count} colis</div>
            </div>
            <div class="city-stat-item">
              <div class="city-stat-label">Poids Total</div>
              <div class="city-stat-val">${Math.round(group.totalWeight * 10) / 10} kg</div>
            </div>
            <div class="city-stat-item">
              <div class="city-stat-label">Montant Total</div>
              <div class="city-stat-val">${group.totalPrice} MAD</div>
            </div>
            ${
              group.unpaidCount > 0
                ? `
              <div class="city-stat-item">
                <div class="city-stat-label">Non Payés</div>
                <div class="city-stat-val" style="color: #dc2626;">${group.unpaidCount} colis</div>
              </div>
            `
                : ''
            }
          </div>
        </div>

        <!-- Colis Listing for this City -->
        <table class="parcels-table">
          <thead>
            <tr>
              <th>#</th>
              <th>N° Suivi</th>
              <th>Expéditeur</th>
              <th>Destinataire</th>
              <th style="text-align: right;">Poids</th>
              <th style="text-align: right;">Prix / État</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Generate full HTML document for a single city.
 */
export function generateCityPrintHTML(
  group: CityColisGroup,
  mode: CityGroupingMode = 'origin',
  direction?: 'MA_TO_FR' | 'FR_TO_MA'
): string {
  const css = getPrintCSS();
  const page = renderSingleCityPageHTML(group, true, 1, 1, mode, direction);

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <title>Bordereau Colis - ${group.city}</title>
        ${css}
      </head>
      <body>
        ${page}
      </body>
    </html>
  `;
}

/**
 * Generate full HTML document for all cities:
 * Every single city starts on a fresh page (page-break-before: always).
 */
export function generateAllCitiesPrintHTML(
  groups: CityColisGroup[],
  mode: CityGroupingMode = 'origin',
  direction?: 'MA_TO_FR' | 'FR_TO_MA'
): string {
  const css = getPrintCSS();
  const totalPages = groups.length;

  const pagesHTML = groups
    .map((group, index) =>
      renderSingleCityPageHTML(
        group,
        index === 0,
        index + 1,
        totalPages,
        mode,
        direction
      )
    )
    .join('\n');

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <title>Bordereaux Tous les Colis par Ville</title>
        ${css}
      </head>
      <body>
        ${pagesHTML}
      </body>
    </html>
  `;
}

/**
 * Generate HTML for an individual Colis (Receipt / Etiquette ticket).
 */
export function generateSingleColisPrintHTML(colis: Colis): string {
  const css = getPrintCSS();
  const isPaid = colis.isPaid !== false;

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <title>Ticket Colis - ${colis.id}</title>
        ${css}
        <style>
          .ticket-container {
            max-width: 520px;
            margin: 20px auto;
            border: 2px dashed #1d4ed8;
            border-radius: 12px;
            padding: 20px;
            background: #fff;
          }
          .ticket-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #1d4ed8;
            padding-bottom: 12px;
            margin-bottom: 14px;
          }
          .ticket-code {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #1d4ed8;
            font-family: monospace;
          }
          .barcode-mock {
            height: 40px;
            background: repeating-linear-gradient(
              90deg,
              #0f172a 0px,
              #0f172a 2px,
              #fff 2px,
              #fff 4px,
              #0f172a 4px,
              #0f172a 7px,
              #fff 7px,
              #fff 10px
            );
            margin: 12px 0;
            border-radius: 4px;
          }
          .section-block {
            background: #f8fafc;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 12px;
          }
        </style>
      </head>
      <body>
        <div class="ticket-container">
          <div class="ticket-header">
            <div>
              <div class="brand-title"> CASMOH</div>
              <div style="font-size: 10px; color: #64748b;">Bordereau / Reçu de transport</div>
            </div>
            <div style="text-align: right;">
              <div class="doc-date">${colis.date}</div>
              <span class="${isPaid ? 'badge-paid' : 'badge-unpaid'}">
                ${isPaid ? 'PAYÉ' : 'À ENCAISSER'}
              </span>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 14px;">
            <div class="ticket-code">${colis.id}</div>
            <div class="barcode-mock"></div>
            <div style="font-size: 11px; font-weight: 600; color: #475569;">
               Trajet: <strong>${colis.fromCity}</strong> ➔ <strong>${colis.toCity}</strong>
            </div>
          </div>

          <div class="section-block">
            <div style="font-size: 9px; text-transform: uppercase; font-weight: 700; color: #16a34a; margin-bottom: 4px;">
              EXPÉDITEUR (DÉPART)
            </div>
            <div style="font-size: 13px; font-weight: 700;">${colis.senderName}</div>
            <div style="font-size: 11px; color: #475569;"> ${colis.senderPhone}</div>
            <div style="font-size: 11px; color: #475569;"> ${colis.fromCity}</div>
          </div>

          <div class="section-block">
            <div style="font-size: 9px; text-transform: uppercase; font-weight: 700; color: #2563eb; margin-bottom: 4px;">
              DESTINATAIRE (ARRIVÉE)
            </div>
            <div style="font-size: 13px; font-weight: 700;">${colis.receiverName}</div>
            <div style="font-size: 11px; color: #475569;"> ${colis.receiverPhone}</div>
            <div style="font-size: 11px; color: #475569;"> ${colis.toCity}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
              Mode: ${colis.isADomicile !== false ? ' Livraison à domicile' : ' Retrait point relais'}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; background: #eff6ff; padding: 10px 14px; border-radius: 8px; margin-bottom: 14px;">
            <div>
              <div style="font-size: 9px; color: #64748b;">POIDS TOTAL</div>
              <div style="font-size: 14px; font-weight: 800; color: #1d4ed8;">${colis.weight} kg</div>
            </div>
            <div>
              <div style="font-size: 9px; color: #64748b;">QUANTITÉ</div>
              <div style="font-size: 14px; font-weight: 800; color: #1d4ed8;">${colis.quantity || 1} pcs</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 9px; color: #64748b;">MONTANT</div>
              <div style="font-size: 14px; font-weight: 800; color: #1d4ed8;">${colis.price} MAD</div>
            </div>
          </div>

          ${
            colis.description
              ? `
            <div style="font-size: 10px; color: #64748b; margin-bottom: 14px; font-style: italic;">
              Contenu: ${colis.description}
            </div>
          `
              : ''
          }
        </div>
      </body>
    </html>
  `;
}

/**
 * Print HTML directly using device printer dialog.
 */
export async function printHtmlContent(html: string): Promise<boolean> {
  try {
    await Print.printAsync({
      html,
    });
    return true;
  } catch (err: any) {
    console.error('Print error:', err);
    Alert.alert('Erreur impression', err?.message || 'Impossible de lancer l’impression.');
    return false;
  }
}

/**
 * Export HTML as a PDF file and open the native Share/Save dialog.
 */
export async function sharePdfFile(html: string, fileName: string = 'ColisExpress_Document.pdf'): Promise<boolean> {
  try {
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: fileName,
      });
      return true;
    } else {
      // Fallback: trigger print
      await Print.printAsync({ html });
      return true;
    }
  } catch (err: any) {
    console.error('Share PDF error:', err);
    Alert.alert('Erreur PDF', err?.message || 'Impossible de générer le fichier PDF.');
    return false;
  }
}
