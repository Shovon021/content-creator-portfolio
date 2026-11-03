import urllib.request

url = "https://scontent.fbzl5-1.fna.fbcdn.net/o1/v/t2/f2/m366/AQMfinAfq63fTTM1XECSVhUOMKEhrHs1zTvhk2dWhZ_rg9YHlGVWI26VhjAG5tX_5PxFSN4RGy3ID6MFjECIMizG9QCoPwH8dsPI5V1N4MuRWQ.mp4?_nc_cat=110&_nc_oc=AdqIwo7zGf1TRBnhVTGED2JbAi8ly314X3FwSxUeCJX-jiUf4-K91RQdcTRBOLvLaEE&_nc_sid=9ca052&_nc_ht=scontent.fbzl5-1.fna.fbcdn.net&_nc_ohc=Ri2sGnIu564Q7kNvwGV_iBJ&efg=eyJ2ZW5jb2RlX3RhZyI6ImRhc2hfdnA5LWJhc2ljLWdlbjJfMTA4MHAiLCJ2aWRlb19pZCI6MTA1NjIzNTg3NDEwMjAxNSwib2lsX3VybGdlbl9hcHBfaWQiOjAsImNsaWVudF9uYW1lIjoidW5rbm93biIsInhwdl9hc3NldF9pZCI6MTU0MzcwODg4MTExNjc5MCwiYXNzZXRfYWdlX2RheXMiOjAsInZpX3VzZWNhc2VfaWQiOjEwMTIyLCJkdXJhdGlvbl9zIjozOSwiYml0cmF0ZSI6Mzk0MTc0OCwidXJsZ2VuX3NvdXJjZSI6Ind3dyJ9&ccb=17-1&_nc_gid=MKdbUNVmpRZhV6tvEV2IDA&_nc_ss=7b2a8&_nc_map=urlgen_bucketless&_nc_zt=28&_nc_eui2=AeH0Nwe1qf2t5mpOpk1uPUvwRmPhvM5_EKtGY-G8zn8QqxHM8jbmr3PnibfbLqIogH3tSytnLCl_JW0RiXiNiIrf&oh=00_AQT2snBGdn5DM83h3uII3Y8l9C-bBVQMxgVfJX_hLo5w0A&oe=6AEBFE12"

print("Downloading real FB 1080p video...")
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Referer': 'https://www.facebook.com/'
})
with urllib.request.urlopen(req, timeout=30) as resp:
    data = resp.read()
    with open("public/videos/real_fb_sample.mp4", "wb") as f:
        f.write(data)
    print(f"Downloaded {len(data)} bytes to public/videos/real_fb_sample.mp4!")

