


export const printLabel = (data) => {


    const printContent = `
        <div style="padding: 16px;" dir="rtl">
          <table style="width: 100%; border-collapse: collapse; text-align: right;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid gray; padding: 8px;">تاریخ</th>
                <th style="border: 1px solid gray; padding: 8px;">روز هفته</th>
                <th style="border: 1px solid gray; padding: 8px;">ساعت ورود</th>
                <th style="border: 1px solid gray; padding: 8px;">ساعت خروج</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  <td style="border: 1px solid gray; padding: 8px;">${row.date}</td>
                  <td style="border: 1px solid gray; padding: 8px;">${row.day}</td>
                  <td style="border: 1px solid gray; padding: 8px;">${row.checkIn}</td>
                  <td style="border: 1px solid gray; padding: 8px;">${row.checkOut}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
    `;

        const myWindow = window.open('', 'printLabel', 'height=800,width=800,top=0, left=0');
        myWindow?.document.write('<html><head><title></title>');
        myWindow?.document.write(
            `
               <style>
               @font-face {
                  font-family: 'MyCustomFont';
                  src: url('public/IRANSansXFaNum-Medium.woff') format('woff');
                }
                * {
                  font-family: 'MyCustomFont', "Open Sans";
                }
</style></head>

`
        );
        myWindow?.document.write('<h1></h1>');
        myWindow?.document.write(printContent);
        myWindow?.document.write('</html>');
        myWindow?.document.write(
            '<scr' +
            'ipt type="text/javascript">' +
            'window.onload = function() { window.print(); ' +
            ' setTimeout(() => {  window.close(); }, 1000);  };' +
            '</script>'
        );
        setTimeout(() => {
            myWindow?.document.close();
            myWindow?.focus();
        }, 1000);
};
