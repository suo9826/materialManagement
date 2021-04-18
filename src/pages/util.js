const templateDownLoad = (value) => {
  const d = value
  const url = d.replace(/\"/g, '')
  const alink = document.createElement('a')
  document.body.appendChild(alink)
  alink.style.display = 'none'
  alink.href = url
  var explorer = window.navigator.userAgent
  if (explorer.indexOf('Firefox') >= 0) {
    alink.download = getTemplateUrl
    const clickEvent = new MouseEvent('click')
    alink.dispatchEvent(clickEvent)
  } else if (explorer.indexOf('Safari') >= 0) {
    alink.target = '_blank'
    alink.addEventListener('click', event => { }, false)
    const clickEvent = new MouseEvent('click', {
      altKey: true
    })
    alink.dispatchEvent(clickEvent)
  } else {
    alink.download = getTemplateUrl
    alink.target = '_blank'
    alink.addEventListener('click', event => { }, false)
    const clickEvent = new MouseEvent('click', {
      altKey: true
    })
    alink.dispatchEvent(clickEvent)
  }
}

module.exports = { templateDownLoad }
