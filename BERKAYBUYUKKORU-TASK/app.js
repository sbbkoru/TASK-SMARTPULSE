// BERKAY BUYUKKORU
var settings = {
  url: "https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history?endDate=2022-04-02&startDate=2022-04-02",
  method: "GET",
  timeout: 0,
  headers: {
    Accept: "application/json",
    Cookie: "seffaflik=1648938172.966.6590.280513",
  },
};
var array1;
var array2 = [];
const toplamIslemTutari = new Map();
const toplamIslemMiktari = new Map();
const agirlikliOrtFiyat = new Map();
const tableJSON = [];
$.ajax(settings).done(function (response) {
  array1 = response.body.intraDayTradeHistoryList;
  array1.forEach((element) => {
    if (element.conract.includes("H")) {
      array2.push(element);
    }
  });
  array2.forEach((element) => {
    if (!toplamIslemTutari.has(element.conract)) {
      toplamIslemTutari.set(element.conract, element.price * element.quantity);
    } else {
      var mapValue = toplamIslemTutari.get(element.conract);
      mapValue += element.price * element.quantity;
      toplamIslemTutari.set(element.conract, mapValue);
    }
    if (!toplamIslemMiktari.has(element.conract)) {
      toplamIslemMiktari.set(element.conract, element.quantity);
    } else {
      var mapValue = toplamIslemMiktari.get(element.conract);
      mapValue += element.quantity;
      toplamIslemMiktari.set(element.conract, mapValue);
    }
  });
  toplamIslemTutari.forEach((value, key) => {
    var newValue = value / 10;
    toplamIslemTutari.set(key, newValue);
  });

  toplamIslemTutari.forEach((value, key) => {
    agirlikliOrtFiyat.set(key, value / toplamIslemMiktari.get(key));
  });
  console.log(toplamIslemTutari);
  console.log(toplamIslemMiktari);
  console.log(agirlikliOrtFiyat);

  toplamIslemTutari.forEach((value, key) => {
    tableJSON.push({
      date: key,
      toplamIslemTutari: value,
      toplamIslemMiktari: toplamIslemMiktari.get(key),
      agirlikliOrtFiyat: agirlikliOrtFiyat.get(key),
    });
  });
  console.log(tableJSON);
  let table = document.getElementById("myTable");
  for (let i = 0; i < tableJSON.length; i++) {
    let row = `<tr>
    <td>${tableJSON[i].date.substr(6, 2)}.${tableJSON[i].date.substr(
      4,
      2
    )}.20${tableJSON[i].date.substr(2, 2)} ${tableJSON[i].date.substr(
      8,
      2
    )}:00</td>
    <td>${tableJSON[i].toplamIslemMiktari}</td>
    <td>₺${tableJSON[i].toplamIslemTutari}</td>
    <td>${tableJSON[i].agirlikliOrtFiyat}</td>
    </tr>
    `;
    table.innerHTML += row;
  }
});
